"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const terminal = document.querySelector('#terminal');
const terminalInput = document.querySelector('#terminal-input');
const terminalOutput = document.querySelector('#terminal-output');
const scrollToBottom = () => {
    terminal.scrollTop = terminal.scrollHeight;
};
var decodeHTML = function (input) {
    var txt = document.createElement('textarea');
    txt.innerHTML = input;
    return txt.value;
};
const terminalCommands = [
    {
        name: 'help',
        description: 'Show all available commands',
        execute: (args) => {
            terminalOutput.innerHTML += `<p>Available commands:</p>`;
            terminalCommands.forEach((command) => {
                terminalOutput.innerHTML += `<p>${command.name}: ${command.description}</p>`;
            });
        },
    },
    {
        name: 'clear',
        description: 'Clear the terminal',
        execute: (args) => {
            terminalOutput.innerHTML = '';
        },
    },
    {
        name: 'echo',
        description: 'Echo the given text',
        awaitMessage: 'Checking message...',
        execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
            yield new Promise((resolve) => setTimeout(resolve, 1000));
            if (args.length > 0) {
                terminalOutput.innerHTML += `<p>${args.join(' ')}</p>`;
            }
            else {
                terminalOutput.innerHTML += `<p>Missing text input</p>`;
            }
        }),
    },
    {
        name: 'tod',
        description: 'Truth or Dare',
        awaitMessage: 'Thinking...',
        execute: (args) => __awaiter(void 0, void 0, void 0, function* () {
            let truthOrDare = Math.random() > 0.5 ? 'Truth' : 'Dare';
            terminalOutput.innerHTML += `<p>${truthOrDare}</p>`;
            terminalInput.style.display = 'block';
            // wait for the user to input something
            yield new Promise((resolve) => {
                terminalInput.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        if (terminalInput.innerHTML.length > 0) {
                            terminalInput.style.display = 'none';
                            console.log('hello');
                            terminalOutput.innerHTML += `<p>${terminalInput.innerHTML}</p>`;
                            resolve();
                        }
                    }
                });
            });
        }),
    },
];
const handleTerminalInput = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (event.key === 'Enter') {
        if (terminalInput.innerHTML.length > 0) {
            terminalInput.style.display = 'none';
            const input = terminalInput.innerHTML;
            terminalInput.innerHTML = '';
            const args = input.split(' ');
            const command = args.shift();
            const commandObject = terminalCommands.find((commandObject) => commandObject.name === command);
            terminalOutput.innerHTML += `<p>> ${input}</p>`;
            if (commandObject) {
                let awaitMessage = 'Processing...';
                terminalOutput.innerHTML += `<p id="await-message">${awaitMessage}</p>`;
                yield commandObject.execute(args);
                (_a = document.querySelector('#await-message')) === null || _a === void 0 ? void 0 : _a.remove();
            }
            else {
                terminalOutput.innerHTML += `<p>Command not found: ${command}</p>`;
            }
            terminalInput.style.display = 'block';
            scrollToBottom();
        }
    }
    else {
        if (event.key === 'Backspace') {
            let newText = decodeHTML(terminalInput.innerHTML).slice(0, -1);
            terminalInput.innerHTML = newText;
        }
        else if ((event.keyCode > 47 && event.keyCode < 58) ||
            (event.keyCode > 64 && event.keyCode < 91) ||
            (event.keyCode > 95 && event.keyCode < 112) ||
            (event.keyCode > 185 && event.keyCode < 193) ||
            (event.keyCode > 218 && event.keyCode < 223) ||
            event.keyCode == 32 ||
            event.keyCode == 13) {
            terminalInput.innerHTML += event.key;
        }
    }
});
document.addEventListener('keydown', handleTerminalInput);
