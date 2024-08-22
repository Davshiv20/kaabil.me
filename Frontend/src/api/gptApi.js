export const API_BASE_URL = "http://localhost:3000"; 

export const imageUpload = () => {
    return `https://www.kaabil.me/api/image/upload`
}

export const openAi = () => {
    return `http://localhost:3000/api/openai`
}

export const messageResponse = ({ questionId }) => {
    return `http://localhost:3000/api/messages/${questionId}`
}

