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
		if (msg.includes("add event") || msg.includes("create event")) {
      			response = 'To create an event, enter the event information under the heading "New Event". Next, press the create event button. An alert will pop up confirming the status of the event creation';
		} else if (msg.includes("delete event")) {
      			response = "To delete event, go to the view events button and then press delete over the event, you want to delete";
		} else if (msg.includes("add user")) {
      			response = 'To add a user, enter the user information under the heading "New Student Account". Next, press Create Account button. An alert will pop up confirming the status of the user creation';
		} else if (msg.includes("delete user") || msg.includes("delete account")) {
      			response = "To delete a user, press the View Accounts button. Next, press the delete button on the particular user. You can also use the search functionality to find the user";
		} else if (msg.includes("prizes")) {
      			response = "The prizes are awarded by the program automatically every quarter. To view the prizes as well as what students got them press the Prizes button on the top of the page";
		} else if (msg.includes("logout")) {
      			response = "To logout simply press the logout button at the top left corner";
		} else if (msg.toLowerCase().includes("hi eve")) {
      			response = "Hi, How can I help you today?";
		} else if (msg.includes("create event")) {
      			response = 'To create an event, enter the event information under the heading "Create Event". Next, press the create event button. An alert will pop up confirming the status of the event creation';
		} else if (msg.includes("generate report")) {
      			response = "Reports can be generated for the different student accounts to view the event they have participated in as well as the points they have collected. To do this, press the View Accounts button and next, press the Generate report button for the required student.";
		} else {
      			response = "I am Sorry, I am not sure if I understand your message";
		}
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
