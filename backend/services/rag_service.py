# services/rag_service.py
#import os
#from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
#from llama_index.llms.openai import OpenAI
#from llama_index.embeddings.openai import OpenAIEmbedding
#from llama_index.core.settings import Settings

#os.environ["OPENAI_API_KEY"] = "sk-..."  

#Settings.llm = OpenAI(model="ft:gpt-4o-mini:sentia-v1-depresion")
#Settings.embed_model = OpenAIEmbedding(model="text-embedding-3-small")

#documents = SimpleDirectoryReader("docs").load_data()
#index = VectorStoreIndex.from_documents(documents)
#query_engine = index.as_query_engine(similarity_top_k=3)

#def answer_with_context(message: str) -> str:
    #response = query_engine.query(message)
    #return str(response)
