const terminal = document.querySelector('#terminal') as HTMLElement
const terminalInput = document.querySelector(
	'#terminal-input'
) as HTMLInputElement
const terminalOutput = document.querySelector(
	'#terminal-output'
) as HTMLDivElement

const scrollToBottom = () => {
	terminal.scrollTop = terminal.scrollHeight
}

var decodeHTML = function (input: string) {
	var txt = document.createElement('textarea')
	txt.innerHTML = input
	return txt.value
}

const terminalCommands = [
	{
		name: 'help',
		description: 'Show all available commands',
		execute: (args: String[]) => {
			terminalOutput.innerHTML += `<p>Available commands:</p>`
			terminalCommands.forEach((command) => {
				terminalOutput.innerHTML += `<p>${command.name}: ${command.description}</p>`
			})
		},
	},
	{
		name: 'clear',
		description: 'Clear the terminal',
		execute: (args: String[]) => {
			terminalOutput.innerHTML = ''
		},
	},
	{
		name: 'echo',
		description: 'Echo the given text',
		awaitMessage: 'Checking message...',
		execute: async (args: String[]) => {
			await new Promise((resolve) => setTimeout(resolve, 1000))
			if (args.length > 0) {
				terminalOutput.innerHTML += `<p>${args.join(' ')}</p>`
			} else {
				terminalOutput.innerHTML += `<p>Missing text input</p>`
			}
		},
	},
	{
		name: 'tod',
		description: 'Truth or Dare',
		awaitMessage: 'Thinking...',
		execute: async (args: String[]) => {
			let truthOrDare = Math.random() > 0.5 ? 'Truth' : 'Dare'
			terminalOutput.innerHTML += `<p>${truthOrDare}</p>`

			terminalInput.style.display = 'block'
			// wait for the user to input something
			//TODO: fix input handling
			await new Promise((resolve: any) => {
				terminalInput.addEventListener(
					'keydown',
					(event: KeyboardEvent) => {
						if (event.key === 'Enter') {
							if (terminalInput.innerHTML.length > 0) {
								terminalInput.style.display = 'none'
								console.log('hello')
								terminalOutput.innerHTML += `<p>Yes</p>`
								resolve()
							}
						}
					}
				)
			})
		},
	},
]

const handleTerminalInput = async (event: KeyboardEvent) => {
	if (event.key === 'Enter') {
		if (terminalInput.innerHTML.length > 0) {
			terminalInput.style.display = 'none'

			const input = terminalInput.innerHTML
			terminalInput.innerHTML = ''
			const args = input.split(' ')
			const command = args.shift()
			const commandObject = terminalCommands.find(
				(commandObject: any) => commandObject.name === command
			)

			terminalOutput.innerHTML += `<p>> ${input}</p>`

			if (commandObject) {
				let awaitMessage = 'Processing...'
				terminalOutput.innerHTML += `<p id="await-message">${awaitMessage}</p>`
				await commandObject.execute(args)
				document.querySelector('#await-message')?.remove() //TODO: fix this
			} else {
				terminalOutput.innerHTML += `<p>Command not found: ${command}</p>`
			}

			terminalInput.style.display = 'block'

			scrollToBottom()
		}
	} else {
		if (event.key === 'Backspace') {
			let newText = decodeHTML(terminalInput.innerHTML).slice(0, -1)
			terminalInput.innerHTML = newText
		} else if (
			(event.keyCode > 47 && event.keyCode < 58) ||
			(event.keyCode > 64 && event.keyCode < 91) ||
			(event.keyCode > 95 && event.keyCode < 112) ||
			(event.keyCode > 185 && event.keyCode < 193) ||
			(event.keyCode > 218 && event.keyCode < 223) ||
			event.keyCode == 32 ||
			event.keyCode == 13
		) {
			terminalInput.innerHTML += event.key
		}
	}
}

document.addEventListener('keydown', handleTerminalInput)
