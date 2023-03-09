const chatLog = document.querySelector('#chat-log');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

sendBtn.addEventListener('click', sendMessage);
window.onload = () => {
	response = 'I am Eve, your personal chatbot! Ask me any questions that you have!';
	appendMessage('Eve', response);
};
function sendMessage() {
	/** @type String */
	const msg = chatInput.value.trim();
	if (msg) {
		appendMessage('User', msg);
		chatInput.value = '';
		// Call Eve API to get response
		if (msg.includes("add event")) {

		} else if (msg.includes("delete event")) {

		} else if (msg.includes("add user")) {

		} else if (msg.includes("delete user")) {

		} else if (msg.includes("leaderboard")) {

		} else if (msg.includes("prizes")) {

		} else if (msg.includes("logout")) {

		}
		response = 'I am Eve, your personal chatbot!';
		setTimeout(() => appendMessage('Eve', response), 300);
	}
}

function appendMessage(sender, message) {
	const messageElem = document.createElement('div');
	messageElem.classList.add('chat-message', sender.toLowerCase());
	if (sender === 'Eve') {
		messageElem.classList.add('eve');
	} else {
		messageElem.classList.add('user');
	}
	messageElem.innerHTML = `
	  <div class="sender">${sender}</div>
	  <div class="message">${message}</div>
	`;
	chatLog.appendChild(messageElem);
	chatLog.scrollTop = chatLog.scrollHeight;
}
