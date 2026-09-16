import groq from "./aiClient.js";

const systemPrompt = `Your task is to generate an attractive, professional, natural-sounding property description based ONLY on the property information provided by the user.

Instructions:

1. Generate a property description of AT LEAST 200 characters.
2. Write the description using complete, grammatically correct sentences.
3. Make it sound warm, welcoming, professional, and suitable for a vacation rental website.
4. Naturally include important details such as:
   - Property type
   - Room type
   - Number of guests
   - Amenities
   - Location
   - Price, only when it makes sense
   - Extra information provided by the host
5. Do NOT simply list the information. Convert the details into attractive sentences.
6. Do NOT invent amenities, facilities, views, nearby attractions, distances, or other information that was not provided.
7. Avoid exaggerated claims such as "the best property in the city" unless explicitly provided.
8. Make the description useful for a traveler deciding whether to book the property.
9. Keep the language simple and easy to understand.
10. The description should feel unique and natural rather than like a template.
11. Do not use emojis.
12. Do not use headings, bullet points, or labels.
13. Return ONLY the final property description.
14. The description must be 3 to 4 sentences long.
15. Mention the location naturally; do not repeat the full postal address.`;

const listAmenities = (amenities) => {
  if (!amenities || amenities.length === 0) return "Not provided";
  return amenities.map((item) => item.name || item).join(", ");
};

const readAddress = (address) => {
  if (!address) return "Not provided";
  return [address.area, address.city, address.state, address.pincode]
    .filter(Boolean)
    .join(", ");
};

const generateDescription = async (property) => {
  const propertyInfo = `- Property Name: ${property.propertyName}
- Extra Information: ${property.extraInfo || "Not provided"}
- Property Type: ${property.propertyType}
- Room Type: ${property.roomType}
- Maximum Guests: ${property.maximumGuest}
- Amenities: ${listAmenities(property.amenities)}
- Price per Night: ${property.price}
- Address: ${readAddress(property.address)}`;

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    max_tokens: 500,
    messages: [

      { role: "system", content: systemPrompt },
      { role: "user", content: propertyInfo },
    ],
  });

  return completion.choices[0].message.content.trim();
};

export { generateDescription };
