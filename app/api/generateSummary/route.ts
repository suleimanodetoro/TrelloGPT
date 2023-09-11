import { NextResponse } from "next/server";
// This is the file we created
import openai from "@/openai";
// This is the library we installed
import OpenAI from "openai";

export async function POST(request: Request) {
  // parse in the todos of the the post request

  const { todos } = await request.json();
  // communicate with Open AI's endpoint
try {
    const response = await openai.chat.completions.create({
        // n is number of calls
        n:1,
        stream:false,
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "When responding, welcome the user as Mr Suleiman and always wish them a good day. Add on a cool fact or motivation about production. Limit to 200 characters",
          },
          {
            role: "user",
            content: `Hi there, provide summary of the following todos. Count how many tasks are in each category such as in To Do, In Progress, and Done, then tell the user a tip on how to go about the tasks! Here is is the data: ${JSON.stringify(
              todos
            )}`,
          },
        ],
      });
      //    Once a response comes back, destructure it
      return NextResponse.json(response.choices[0].message);
      
       

    
} catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error(error.status);  // e.g. 401
      console.error(error.message); // e.g. The authentication token you passed was invalid...
      console.error(error.code);  // e.g. 'invalid_api_key'
      console.error(error.type);  // e.g. 'invalid_request_error'
    } else {
      // Non-API error
      console.log(error);
    }
  }

}
