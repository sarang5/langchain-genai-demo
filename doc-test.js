import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as fs from "fs";
import { ChatOpenAI } from "langchain/chat_models/openai";

// export const run = async () => {
  // Initialize the LLM to use to answer the question.
  const model = new OpenAI({
    temperature: 0.9,
    azureOpenAIApiKey: '4fa96db892874c008a8d25f104e4610b',
    azureOpenAIApiVersion: '2023-03-15-preview',
    azureOpenAIApiInstanceName: 'azeus-openai-01',
    azureOpenAIApiDeploymentName: 'gpt-35-model'
  });

  const chatmodel = new ChatOpenAI({
    temperature: 0.9,
    // openAIApiKey: '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'
    azureOpenAIApiKey: '4fa96db892874c008a8d25f104e4610b',
    azureOpenAIApiVersion: '2023-03-15-preview',
    azureOpenAIApiInstanceName: 'azeus-openai-01',
    azureOpenAIApiDeploymentName: 'gpt-35-model'
})

  const text = fs.readFileSync("FAQS.txt", "utf8");

  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const docs = await textSplitter.createDocuments([text]);
  console.log(docs)

  // Create a vector store from the documents.
  const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings({
    azureOpenAIApiKey: '4fa96db892874c008a8d25f104e4610b',
    azureOpenAIApiVersion: '2023-03-15-preview',
    azureOpenAIApiInstanceName: 'azeus-openai-01',
    azureOpenAIApiDeploymentName: 'text-embedding-ada-002'
  }
  ));
  console.log('--vector')

  // Create a chain that uses the OpenAI LLM and HNSWLib vector store.
  const chain = RetrievalQAChain.fromLLM(chatmodel, vectorStore.asRetriever());
  console.log('--chain')
  const res = await chain.call({
    query: "I want to self assign case?",
  });
  console.log({ res });

  const res1 = await chain.call({
    query: "what did I ask last?",
  });
  console.log({ res1 });