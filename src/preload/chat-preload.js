const chatLog = document.querySelector("#chat-log");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

let syns;
(async () =>
  (syns = await (await fetch("../database/synonyms.json")).json()))();
sendBtn.addEventListener("click", sendMessage);
window.onload = () => {
  response =
    "I am Eve, your personal chatbot! Ask me any questions that you have!";
  appendMessage("Eve", response);
};
/**
 * Finds synonyms for a word. This is a recursive function so it's safe to call multiple times
 *
 * @param word - The word to look for synonyms for.
 *
 * @return { Array } An array of synonyms for the word or an empty array if there are no synonyms for the
 */
function synonyms(word) {
  const results = [];
  for (let group of syns) {
    // Adds a word to the results array
    if (group.includes(word)) {
      for (let word of group) {
        // Add a word to the results list.
        if (!results.includes(word)) {
          results.push(word);
        }
      }
    }
  }
  return results;
}
/**
 * Checks if any message is in the iterable. This is useful for debugging and to avoid using Array. prototype. indexOf when there are many messages to check
 *
 * @param msg - The message to check for
 * @param iterable - The iterable to check against
 *
 * @return { boolean } True if any message is in the iterable false if not or if the iterable is empty
 */
function any(msg, iterable) {
  return iterable.includes(msg);
}

/**
 * Function to send a message to Eve based on user input. It is called by clicking on the button
 */
function sendMessage() {
  /** @type String */
  let msg = chatInput.value.trim();
  // This method is called by Eve API to get the user s response
  if (msg) {
    appendMessage("User", msg);
    msg = msg.toLowerCase();
    chatInput.value = "";
    // Call Eve API to get response
    // This method is used to generate a string describing the user s response.
    if (
      (any(msg, synonyms("add")) ||
        any(msg, synonyms("create")) ||
        msg.includes("create") ||
        msg.includes("add")) &&
      msg.includes("event")
    ) {
      response =
        'To create an event, enter the event information under the heading "New Event". Next, press the create event button. An alert will pop up confirming the status of the event creation';
      // This method is used to display the response
    } else if (
      (any(msg, synonyms("delete")) ||
        msg.includes("delete") ||
        any(msg, synonyms("remove")) ||
        msg.includes("remove")) &&
      msg.includes("event")
    ) {
      response =
        "To delete event, go to the view events button and then press delete over the event, you want to delete";
      // This method is used to display the user s response
    } else if (
      (any(msg, synonyms("add")) ||
        any(msg, synonyms("create")) ||
        msg.includes("create") ||
        msg.includes("add")) &&
      (msg.includes("student") || msg.includes("account"))
    ) {
      response =
        'To add a student, enter the student information under the heading "New Student Account". Next, press Create Account button. An alert will pop up confirming the status of the user creation';
      // This method is used to display the response message
    } else if (
      (any(msg, synonyms("delete") || msg.includes("delete")) &&
        msg.includes("student")) ||
      msg.includes("user") ||
      msg.includes("account")
    ) {
      response =
        "To delete a user, press the View Accounts button. Next, press the delete button on the particular user. You can also use the search functionality to find the user";
      // This method is used to display the message
    } else if (any(msg, synonyms("prizes")) || msg.includes("prizes")) {
      response =
        "The prizes are awarded by the program automatically every quarter. To view the prizes as well as what students got them press the Prizes button on the top of the page";
      // This method is used to display the message
    } else if (msg.includes("logout") || any(msg, synonyms("logout"))) {
      response =
        "To logout simply press the logout button at the top left corner";
      // This method is used to display the message
    } else if (
      msg.includes("hi") ||
      msg.includes("hello") ||
      any(msg, synonyms("hi"))
    ) {
      response = "Hi, How can I help you today?";
      // This method is called by the user when the user clicks on the student account.
    } else if (msg.includes("report") || any(msg, synonyms("report"))) {
      response =
        "Reports can be generated for the different student accounts to view the event they have participated in as well as the points they have collected. To do this, press the View Accounts button and next, press the Generate report button for the required student.";
      // This method is called when the user asks for questions like create event or how to delete a student account or an even.
    } else if (msg.includes("question") || any(msg, synonyms("question"))) {
      response =
        "You can ask questions like: How to create an event or How to delete a student account or How to delete an even";
    } else {
      response = "I am sorry, I am not sure if I understand your message.";
    }
    setTimeout(() => appendMessage("Eve", response), 300);
  }
}

/**
 * Appends a message to the chat log. This is used to send messages to the user or eve that are in the chat.
 *
 * @param sender - The user or eve that sent the message.
 * @param message - The message to append to the log. Should be UTF - 8
 */
function appendMessage(sender, message) {
  const messageElem = document.createElement("div");
  messageElem.classList.add("chat-message", sender.toLowerCase());
  // Add Eve or user to the message list
  if (sender === "Eve") {
    messageElem.classList.add("eve");
  } else {
    messageElem.classList.add("user");
  }
  messageElem.innerHTML = `
	  <div class="sender">${sender}</div>
	  <div class="message">${message}</div>
	`;
  chatLog.appendChild(messageElem);
  chatLog.scrollTop = chatLog.scrollHeight;
}
