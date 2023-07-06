import { OpenAI } from "langchain/llms/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { BufferMemory } from "langchain/memory";
import * as fs from "fs";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder, SystemMessagePromptTemplate } from "langchain/prompts";

// export const run = async () => {
  /* Initialize the LLM to use to answer the question */
  const model = new OpenAI({
    temperature: 0,
    // openAIApiKey: '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'
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

  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
        "You are a chatbot assistant for Crown CSOP agents. It should be a friendly conversation and should answer CSOP agents questions related to Crown tool only.\n "+
        "Crown is a tool used for credit fraud investigation purpose. If you do not know the answer please mention truthfully. The answers should be only come from the context supplied."
    ),
    new MessagesPlaceholder('chat_history'),
    HumanMessagePromptTemplate.fromTemplate("{input}")
  ])

  /* Load in the file we want to do question answering over */
  const text = fs.readFileSync("sop.txt", "utf8");
  /* Split the text into chunks */
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const docs = await textSplitter.createDocuments([text]);
  /* Create the vectorstore */
  const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings({
        azureOpenAIApiKey: '4fa96db892874c008a8d25f104e4610b',
        azureOpenAIApiVersion: '2023-03-15-preview',
        azureOpenAIApiInstanceName: 'azeus-openai-01',
        azureOpenAIApiDeploymentName: 'text-embedding-ada-002'
    })
);
  /* Create the chain */
  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorStore.asRetriever(),
    {
      memory: new BufferMemory({
        // returnMessages: true,
        memoryKey: "chat_history", // Must be set to "chat_history"
      })
    }
  );
  /* Ask it a question */
  const question = "what is cci review?";
  const res = await chain.call({ question });
  console.log(res);


  

//   /* Ask it a follow up question */
//   const followUpRes = await chain.call({
//     question: "Was that nice?",
//   });
//   console.log(followUpRes);
// };