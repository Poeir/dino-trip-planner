import { api } from "./client.js";

export const get_all_place = async () => api.get("/places");