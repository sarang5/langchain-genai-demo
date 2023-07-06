import { OpenAI } from "langchain/llms/openai";

const model = new OpenAI({
    // modelName: 'gpt-35-model',
    temperature: 0,
    azureOpenAIApiKey: '4fa96db892874c008a8d25f104e4610b',
    azureOpenAIApiVersion: '2023-03-15-preview',
    azureOpenAIApiInstanceName: 'azeus-openai-01',
    azureOpenAIApiDeploymentName: 'gpt-35-model'
});

const res = await model.call(
    "What would be a good company name a company that makes colorful socks? Give me 2 best options for mentioned question."
);

console.log(res);