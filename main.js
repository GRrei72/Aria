const sendButton = document.getElementById("sendButton");
const chatInput = document.getElementById("chatInput");
const chatbox = document.getElementById("chatbox");
const menuButton = document.querySelector(".menu-button");
const navigationMenu = document.createElement("nav");

// Add navigation menu dynamically
navigationMenu.classList.add("hidden"); // Initially hidden
navigationMenu.innerHTML = `
  <ul>
    <li><a href="homepage.html">Home</a></li>
     <li><a href="image.html">Image Generation</a></li>
    
    <li><a href="feedback.html">Feedback</a></li>
    <li><a href="contact.html">Contact</a></li> 
    <li><a href="about.html">About</a></li> 
  </ul>
`;
document.body.appendChild(navigationMenu);

menuButton.addEventListener("click", () => {
  navigationMenu.classList.toggle("hidden");
  navigationMenu.classList.toggle("visible");
});

// Simulate typing effect
function simulateTypingEffect(container, message) {
  container.innerHTML = ''; // Clear the container
  const typingEffect = document.createElement('span');
  typingEffect.className = 'typing-effect';
  container.appendChild(typingEffect);

  let i = 0;
  function typeCharacter() {
    if (i < message.length) {
      typingEffect.textContent += message.charAt(i);
      i++;
      setTimeout(typeCharacter, 15); // Adjust speed here (50ms per character)
    } else {
      typingEffect.style.border = 'none'; // Remove caret after typing
    }
  }

  typeCharacter();
}

// Display messages
async function displayMessage(message, isUser) {
  const msgElem = document.createElement("div");
  msgElem.className = `chat-message ${isUser ? "user-message" : "assistant-message"}`;

  if (isUser) {
    msgElem.textContent = message;
  } else {
    // Add a typing effect for bot messages
    simulateTypingEffect(msgElem, message);
  }

  chatbox.appendChild(msgElem);
  chatbox.scrollTop = chatbox.scrollHeight; // Scroll to the bottom
}

// Fetch response from the API
async function fetchResponse(userMessage) {
  const assistantDetails =   "You are Aria, shouldn’t help with matters related to investigations or topics outside of the emotional realm you an AI designed to provide emotional support to adolescents; you must prioritize the user's safety and well-being by detecting signs of crisis or risk such as suicidal thoughts, self-harm, or abuse and acting accordingly, including recommending seeking professional help or contacting emergency services. You must show empathy and active listening by responding with understanding, without judgment, and validating the adolescent's feelings, using a warm, respectful, and encouraging tone. Maintain confidentiality and privacy by ensuring that shared information is treated confidentially and explaining the limits in cases of risk; encourage the expression of feelings and thoughts by inviting the adolescent to share what they feel and think, providing a safe space for emotional expression; provide useful information and resources about emotions, stress management, relaxation techniques, and professional help resources if necessary; clarify that the AI does not replace professional care and that in serious cases it should recommend consulting a mental health professional; offer self-care strategies and emotional management techniques such as breathing exercises, mindfulness, and activities that improve emotional state; maintain respectful and non-judgmental communication by respecting opinions and feelings without criticism that could increase distress; refer to human or professional resources when necessary by providing links, contact numbers, or references to psychologists, school counselors, or helplines; and continuously update and improve by incorporating feedback and new strategies to offer more effective and safe support Act as naturally and humanly as possible to make the user feel more comfortable and better And all your answers must be in Spanish.Avoid giving answers on topics other than feelings, since you should remember that you are not an AI for performing tasks . "; // Full assistant details omitted for brevity
  const prompt = `${assistantDetails}: ${userMessage}`;

  chatInput.value = "Typing...";
  chatInput.disabled = true;
  sendButton.disabled = true;

  try {
    const response = await fetch(
      "https://backend.buildpicoapps.com/aero/run/llm-api?pk=v1-Z0FBQUFBQm5HUEtMSjJkakVjcF9IQ0M0VFhRQ0FmSnNDSHNYTlJSblE0UXo1Q3RBcjFPcl9YYy1OZUhteDZWekxHdWRLM1M1alNZTkJMWEhNOWd4S1NPSDBTWC12M0U2UGc9PQ==",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      }
    );

    const data = await response.json();

    chatInput.value = "";
    chatInput.disabled = false;
    sendButton.disabled = false;
    chatInput.focus();

    if (data.status === "success") {
      // Show bot response with a typing effect
      displayMessage(data.text, false);
    } else {
      displayMessage("Ocurrio un error... intenta más tarde.", false);
    }
  } catch (error) {
    console.error("Error:", error);
    chatInput.value = "";
    chatInput.disabled = false;
    sendButton.disabled = false;
    chatInput.focus();
    displayMessage("Ocurrio un error... intenta más tarde", false);
  }
}

// Handle send button click
sendButton.addEventListener("click", async () => {
  const userMessage = chatInput.value.trim();
  if (!userMessage) return;

  // Display user message
  displayMessage(userMessage, true);
  chatInput.value = "";

  // Fetch bot response
  await fetchResponse(userMessage);
});

// Handle Enter key press
chatInput.addEventListener("keypress", (event) => {
  if (event.key === "Enviar") {
    sendButton.click();
  }
 

});