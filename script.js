const textarea = document.querySelector('textarea')

const initialTextareaHeight = textarea.scrollHeight

async function createBotReplay (content) {
    const API_URL = 'https://api.openai.com/v1/chat/completions'
    const API_KEY = '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'

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'content-Type' : 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{
                role: 'user',
                content
            }]
        })
    })

    const data = await response.json()

    return data.choices[0].message.content
}

function createChatMessage(message, type) {
    const li = document.createElement('li')
    li.classList.add('message', type)

    const p = document.createElement('p')

    if (type === 'bot') {
        const i = document.createElement('i')
        i.classList.add('fa-solid', 'fa-robot', 'fa-xl')
        li.appendChild(i)
    }

    p.textContent = message
    li.appendChild(p)

    return li
}

function handleCloseChat( ) {
    document.body.classList.remove('open-chat')
}

function handleTogglerChat( ) {
    document.body.classList.toggle('open-chat')
}

function handleChatOnKeyDown (event) {
    if ( event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        handleChat
    }
}

function handleAutoSize() {
    textarea.style.height = `${initialTextareaHeight}px`
    textarea.style.height = `${textarea.scrollHeight}px`
}

async function handleChat () {
    const textareaValue = textarea.value.trim()

    if (!textareaValue) {
        return 
    }

    const main = document.querySelector('main')
    const messageHistory = document.querySelector('ul')

    const userMessage = createChatMessage(textareaValue, 'user')

    messageHistory.appendChild(userMessage)
    main.scrollTo(0, main.scrollHeight)

    textarea.value = ''

    const botMessage = createChatMessage('Digitando...', 'bot')

    setTimeout(() => {
        messageHistory.appendChild(botMessage)
        main.scrollTo(0, main.scrollHeight)
    }, 500)

    try {
        const botReplay = await createBotReplay(textareaValue)

        botMessage.querySelector('p').textContent = botReplay
        messageHistory.scrollTo(0, messageHistory.scrollHeight)
    } catch (error) {
        botMessage.querySelector('p').textContent = 'Ops! Algo deu errado. Por favor tente novamente.'
        botMessage.querySelector('p').classList.add('error')
    }
}