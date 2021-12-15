import TextField from "@material-ui/core/TextField"
import React, { useEffect, useRef, useState } from "react"
import io from "socket.io-client"
import "./App.css"

function App() {
	const [ state, setState ] = useState({ message: "", name: "" })
	const [ chat, setChat ] = useState([])
	const [ toggleNameField, setToggleNameField ] = useState(false)

	const socketRef = useRef()

	useEffect(
		() => {
			socketRef.current = io.connect("http://localhost:4000")
			socketRef.current.on("message", ({ name, message }) => {
				setChat([ ...chat, { name, message } ])
			})
			return () => socketRef.current.disconnect()
		},
		[ chat ]
	)

	const onTextChange = (e) => {
		setState({ ...state, [e.target.name]: e.target.value })
	}

	const onMessageSubmit = (e) => {
		const { name, message } = state
		e.preventDefault()
		if(!state.name == '' && !state.message == '' ){
			socketRef.current.emit("message", { name, message })
			setState({ message: "", name })
			setToggleNameField(true)
		}else{
			alert('Please enter proper data')
		}
	}

	const renderChat = () => {
		return chat.map(({ name, message }, index) => (
			<div key={index}>
				<h3>
					{name}: <span>{message}</span>
				</h3>
			</div>
		))
	}

	return (
		<div className="card">
			<div className="render-chat">
				<h1>Chat Log</h1>
				<div className="chat-wrapper">
					{renderChat()}
				</div>
			</div>
			<form onSubmit={onMessageSubmit}>
				<h1>Messenger</h1>
				{!toggleNameField ? 
					<div className="name-field">
						<TextField name="name" onChange={(e) => onTextChange(e)} value={state.name} label="Name" />
					</div>
					: null
				}
				<div>
					<TextField
						name="message"
						onChange={(e) => onTextChange(e)}
						value={state.message}
						id="outlined-multiline-static"
						variant="outlined"
						label="Message"
					/>
				</div>
				<button>Send Message</button>
			</form>
		</div>
	)
}

export default App

