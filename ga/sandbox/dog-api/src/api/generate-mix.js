import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  const { breedOne, breedTwo } = req.body;

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a realistic photo of a dog that is a mix between a ${breedOne} and a ${breedTwo}. The image should clearly show characteristics of both breeds.`,
      n: 1,
      size: "1024x1024",
    });

    return res.status(200).json({ imageUrl: response.data[0].url });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return res.status(500).json({ error: 'Failed to generate image' });
  }
} 
