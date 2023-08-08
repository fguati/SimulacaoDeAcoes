import { INegotiation } from "Interfaces/INegotiation";

interface INegotiationAPIRes {
    negotiations: INegotiation[]
    numberOfPages: number
}

export default INegotiationAPIRes