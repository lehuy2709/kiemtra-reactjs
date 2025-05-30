import api from "../plugins/api"

export const getMethod = async (endpoint: string) => {
    try {
        const { data } = await api.get(endpoint)
        return data
    }
    catch (e) {
        console.log(e);
    }

    return null
}

export const postMethod = async (endpoint: string, payload: any) => {
    try {
        const { data } = await api.post(endpoint, payload)
        return data
    }
    catch (e) {
        console.log(e);
    }

    return null
}

export const deleteMethod = async (endpoint: string) => {
    try {
        await api.delete(endpoint)
        return true
    }
    catch (e) {
        console.log(e);
        return false
    }
}