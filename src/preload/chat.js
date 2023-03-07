// chat.js
const chatForm = document.querySelector("#chat-form");
const chatInput = document.querySelector("#chat-input");
const chatLog = document.querySelector("#chat-log");

chatForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const message = chatInput.value;
	displayMessage("You", message);
	chatInput.value = "";
	function respond(trigger, response) {
		if (message.includes(trigger)) {
			response();
		}
	}
	// Call your chatbot API or function here to generate response
	respond("add event", () => {});

	respond("delete event", () => {});

	respond("add user", () => {});

	respond("delete user", () => {});

	respond("leaderboard", () => {});

	respond("prizes", () => {});
	// and call displayMessage again with the response as the second argument
});

function displayMessage(sender, message) {
	const newMessage = document.createElement("div");
	newMessage.innerHTML = `<strong>${sender}:</strong> ${message}`;
	chatLog.appendChild(newMessage);
	chatLog.scrollTop = chatLog.scrollHeight;
}

// Call any necessary setup code here, such as setting focus to the chat input
chatInput.focus();
