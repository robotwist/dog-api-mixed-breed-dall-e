import { useState, useEffect } from 'react'
import './App.css'
import OpenAI from 'openai';

function App() {
  const openai = new OpenAI({
    apiKey: 'sk-proj000-4nH_iApe000jDkL7',
    dangerouslyAllowBrowser: true,
    projectId: 'proj_kW2pbPCfS5GRaSZypLFS5c4j' // Add your project ID here
  });

  const [breeds, setBreeds] = useState([])
  const [selectedBreedOne, setSelectedBreedOne] = useState('')
  const [selectedBreedTwo, setSelectedBreedTwo] = useState('')
  const [breedOneImage, setBreedOneImage] = useState('')
  const [breedTwoImage, setBreedTwoImage] = useState('')
  const [generatedImage, setGeneratedImage] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [dogPoem, setDogPoem] = useState('')

  useEffect(() => {
    console.log(openai)
    fetch('https://dog.ceo/api/breeds/list/all')
      .then(response => response.json())
      .then(data => setBreeds(Object.keys(data.message)))
      .catch(error => console.error('Error fetching breeds:', error))
  }, [])

  const handleBreedOneChange = (event) => {
    const breed = event.target.value
    setSelectedBreedOne(breed)
    if (breed) {
      fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
        .then(response => response.json())
        .then(data => {
          setBreedOneImage(data.message)
        })
        .catch(error => console.error('Error fetching breed image:', error))
    }
  }

  const handleBreedTwoChange = (event) => {
    const breed = event.target.value
    setSelectedBreedTwo(breed)
    if (breed) {
      fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
        .then(response => response.json())
        .then(data => {
          setBreedTwoImage(data.message)
        })
        .catch(error => console.error('Error fetching breed image:', error))
    }
  }

  const handleGenerateMix = async () => {
    if (!selectedBreedOne || !selectedBreedTwo) {
      alert('Please select both breeds first')
      return
    }

    setIsGenerating(true)
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Create a realistic photo of a dog that is a mix between a ${selectedBreedOne} and a ${selectedBreedTwo}. The image should clearly show characteristics of both breeds.`,
        n: 1,
        size: "1024x1024",
      });
      setGeneratedImage(response.data[0].url)

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            { role: "developer", content: "You are a helpful assistant." },
            {
                role: "user",
                content: `Write a poem in the form of villanelle about ${selectedBreedOne} and ${selectedBreedTwo}.`,
            },
        ],
        store: true,
    });
    console.log(completion.choices[0].message)
    setDogPoem(completion.choices[0].message.content);
  
    } catch (error) {
      console.error('OpenAI API error:', error);
    }
    // try {
    //   const response = await fetch('/api/generate-mix', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       breedOne: selectedBreedOne,
    //       breedTwo: selectedBreedTwo,
    //     }),
    //   })

    //   const data = await response.json()
    //   setGeneratedImage(data.imageUrl)
    // } catch (error) {
    //   console.error('Error generating mixed breed image:', error)
    //   alert('Failed to generate mixed breed image')
    // } finally {
    //   setIsGenerating(false)
    // }
  }

  return (
    <>
      <select onChange={handleBreedOneChange} value={selectedBreedOne}>
        <option value="">Select a breed</option>
        {breeds.map((breed) => (
          <option key={breed} value={breed}>
            {breed}
          </option>
        ))}
      </select>
      {breedOneImage && (
        <div>
          <h2>{selectedBreedOne}</h2>
          <img src={breedOneImage} alt={selectedBreedOne} />
        </div>
      )}

      <select onChange={handleBreedTwoChange} value={selectedBreedTwo}>
        <option value="">Select a breed</option>
        {breeds.map((breed) => (
          <option key={breed} value={breed}>
            {breed}
          </option>
        ))}
      </select>
      
      {breedTwoImage && (
        <div>
          <h2>{selectedBreedTwo}</h2>
          <img src={breedTwoImage} alt={selectedBreedTwo} />
        </div>
      )}

      <button 
        onClick={handleGenerateMix}
        disabled={!selectedBreedOne || !selectedBreedTwo || isGenerating}
      >
        {isGenerating ? 'Generating...' : 'Generate Mixed Breed Image'}
      </button>

      {generatedImage && (
        <div>
          <h2>AI Generated Mix of {selectedBreedOne} & {selectedBreedTwo}</h2>
          <img src={generatedImage} alt={`${selectedBreedOne}-${selectedBreedTwo} mix`} />
        </div>
      )}
      {dogPoem && (
        <div>
          <h2>Dog Poem</h2>
          <p>{dogPoem}</p>
        </div>
      )}
    </>
  )
}

export default App
