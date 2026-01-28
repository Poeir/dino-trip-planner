import { api } from "./client.js";

export const get_one_place = async (id) => api.get(`/places/${id}`);