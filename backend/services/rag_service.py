import os
from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
from llama_index.llms.openai import OpenAI
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core.settings import Settings

os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")  

Settings.llm = OpenAI(model="ft:gpt-4o-mini-2024-07-18:sentia:dataset-depresion-sentia-v1:BbYv6ZsM")
Settings.embed_model = OpenAIEmbedding(model="text-embedding-3-small")

documents = SimpleDirectoryReader("docs").load_data()
index = VectorStoreIndex.from_documents(documents)
query_engine = index.as_query_engine(similarity_top_k=3)

def answer_with_context(message: str) -> str:
    response = query_engine.query(message)

    # Imprimir las fuentes utilizadas
    print("🔍 Fuentes utilizadas:")
    for node in response.source_nodes:
        print("📄 Documento recuperado:")
        print(node.node.get_content())  # Este es el fragmento que usó el motor RAG
        
    return str(response)
