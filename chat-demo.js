import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";

const model = new ChatOpenAI({
    temperature: 0.9,
    // openAIApiKey: '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'
    azureOpenAIApiKey: '4fa96db892874c008a8d25f104e4610b',
    azureOpenAIApiVersion: '2023-03-15-preview',
    azureOpenAIApiInstanceName: 'azeus-openai-01',
    azureOpenAIApiDeploymentName: 'gpt-35-model'
})

const res = await model.call([
    new SystemChatMessage("You are an assistant to respond to questions with two best options."),
    new HumanChatMessage( "What would be a good company name a company that makes shoes?")
]);

console.log(res);