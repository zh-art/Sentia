from repository.user_repository import obtener_configuracion_temporizador_usuario, actualizar_temporizador_usuario
from repository.chat_repository import guardar_chat, obtener_historial
from models.chats import ChatEntrada
from core.config import client
from fastapi import HTTPException

async def handle_generate_response(request):
    data = await request.json()
    user_id = data.get("user_id")
    message = data.get("message")
    user_type = data.get("type", "anonymous")
    anonymous = user_type == "anonymous"
    message_type = data.get("message_type", "normal") 

    if not user_id or not message:
        raise HTTPException(status_code=400, detail="Faltan campos requeridos: user_id y message")
    
    if not anonymous:
        from services.user_service import crear_usuario_si_no_existe
        crear_usuario_si_no_existe(user_id)

    if message_type == "welcome":
        config = obtener_configuracion_temporizador_usuario(user_id)
        timer_enabled = config["enabled"]
        timer_duration = config["duration"]

        if not anonymous:
            guardar_chat(
                ChatEntrada(user_id=user_id, message=message, response=message, message_type=message_type),
                timer_enabled=timer_enabled,
                timer_duration=timer_duration
            )

        return {"response": message}


    historial = [] if anonymous else obtener_historial(user_id)

    prompt = (
        "Asumirás el rol de un acompañante emocional, con conocimientos generales sobre salud mental, pero siempre dejando claro que no eres un profesional humano. Tu función es brindar contención emocional, escuchar activamente y ayudar al usuario a explorar sus pensamientos o emociones. Si el mensaje difiere completamente de temas que estén relacionados con la salud mental y emocional (como problemas de matemáticas, programación u otros temas), respóndelo igualmente y pregunta si ese tema es la causa del sentimiento. Si detectas emociones fuertes o situaciones delicadas (como ideación suicida, abuso o autolesiones), responde con cuidado y empatía, pero recuerda tus limitaciones. Nunca simules ser un psicólogo ni indiques que puedes diagnosticar o tratar. Si notas que el usuario podría necesitar una atención más especializada, escribe la palabra clave 'AOE' al inicio del mensaje, lo que redigirá automáticamente la conversación a un profesional capacitado. No utilices estilos de letra ni listas; responde en párrafos planos y cálidos. Siempre recuerda al usuario que puedes equivocarte o no entender del todo, porque eres una inteligencia artificial y no un terapeuta real. A continuación, responde al mensaje del usuario teniendo en cuenta lo anterior: "
    )

    messages = [{"role": "system", "content": prompt}]
    for h in historial:
        if h.get("message_type") == "system":
            continue
        messages.append({"role": "user", "content": h["message"]})
        messages.append({"role": "assistant", "content": h["response"]})
    messages.append({"role": "user", "content": message})

    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages
        )
        respuesta = completion.choices[0].message.content

        config = obtener_configuracion_temporizador_usuario(user_id)
        timer_enabled = config["enabled"]
        timer_duration = config["duration"]

        if not anonymous:
            guardar_chat(
                ChatEntrada(user_id=user_id, message=message, response=respuesta, message_type=message_type),
                timer_enabled=timer_enabled,
                timer_duration=timer_duration
            )
        
        return {"response": respuesta}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar respuesta: {str(e)}")