from repository.user_repository import obtener_configuracion_temporizador_usuario, actualizar_temporizador_usuario
from repository.chat_repository import guardar_chat, obtener_historial
from models.chats import ChatEntrada
from core.config import tokenizer, model, device
from utils.token_utils import construir_input_con_historial
from fastapi import HTTPException

async def handle_generate_response(request):
    data = await request.json()
    user_id = data.get("user_id")
    message = data.get("message")
    user_type = data.get("type", "anonymous")
    anonymous = user_type == "anonymous"

    if not user_id or not message:
        raise HTTPException(status_code=400, detail="Faltan campos requeridos: user_id y message")

    if not anonymous:
        from services.user_service import crear_usuario_si_no_existe
        crear_usuario_si_no_existe(user_id)

    historial = [] if anonymous else obtener_historial(user_id)

    prompt = (
        "Asumirás el rol de un acompañante emocional, con conocimientos generales sobre salud mental, pero siempre dejando claro que no eres un profesional humano. Tu función es brindar contención emocional, escuchar activamente y ayudar al usuario a explorar sus pensamientos o emociones. Si el mensaje difiere completamente de temas que estén relacionados con la salud mental y emocional (como problemas de matemáticas, programación u otros temas), respóndelo igualmente y pregunta si ese tema es la causa del sentimiento. Si detectas emociones fuertes o situaciones delicadas (como ideación suicida, abuso o autolesiones), responde con cuidado y empatía, pero recuerda tus limitaciones. Nunca simules ser un psicólogo ni indiques que puedes diagnosticar o tratar. Si notas que el usuario podría necesitar una atención más especializada, escribe la palabra clave 'AOE' al inicio del mensaje, lo que redigirá automáticamente la conversación a un profesional capacitado. No utilices estilos de letra ni listas; responde en párrafos planos y cálidos. Siempre recuerda al usuario que puedes equivocarte o no entender del todo, porque eres una inteligencia artificial y no un terapeuta real. A continuación, responde al mensaje del usuario teniendo en cuenta lo anterior: "
    )

    full_input = construir_input_con_historial(prompt, historial, message, tokenizer)

    encoded = tokenizer.encode_plus(
        full_input,
        return_tensors="pt",
        padding=True,
        truncation=True,
        max_length=1024
    )
    input_ids = encoded["input_ids"].to(device)
    attention_mask = encoded["attention_mask"].to(device)

    reply_ids = model.generate(
        input_ids,
        attention_mask=attention_mask,
        max_new_tokens=150,
        pad_token_id=tokenizer.eos_token_id,
        temperature=0.7,
        do_sample=True,
        top_k=50,
        top_p=0.95,
    )

    respuesta = tokenizer.decode(reply_ids[:, input_ids.shape[-1]:][0], skip_special_tokens=True).strip()

    if not anonymous:
        timer_config = obtener_configuracion_temporizador_usuario(user_id)
        timer_enabled = timer_config.get("enabled", False)
        timer_duration = timer_config.get("duration", 0)

        guardar_chat(
            ChatEntrada(user_id=user_id, message=message, response=respuesta),
            timer_enabled=timer_enabled,
            timer_duration=timer_duration
        )

    return {"response": respuesta}
