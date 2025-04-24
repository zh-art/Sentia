def construir_input_con_historial(prompt, historial, message, tokenizer, max_tokens=1024):
    prompt_tokens = tokenizer.encode(prompt, return_tensors="pt").shape[-1]
    message_tokens = tokenizer.encode(message + tokenizer.eos_token, return_tensors="pt").shape[-1]
    available_tokens = max_tokens - prompt_tokens - message_tokens

    history_text = ""
    tokens_used = 0
    mensajes_usados = 0

    for item in reversed(historial):
        chunk = item["message"] + tokenizer.eos_token + item["response"] + tokenizer.eos_token
        chunk_tokens = tokenizer.encode(chunk, return_tensors="pt").shape[-1]

        if tokens_used + chunk_tokens > available_tokens:
            break
        history_text = chunk + history_text
        tokens_used += chunk_tokens
        mensajes_usados += 1

    print(f"[INFO] Prompt: {prompt_tokens} | Message: {message_tokens} | Historial tokens: {tokens_used} | Mensajes usados: {mensajes_usados}")
    return prompt +  history_text + message + tokenizer.eos_token
