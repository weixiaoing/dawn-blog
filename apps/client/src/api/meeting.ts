import request from "./request";

export async function getMeeting() {
    return request(`meeting/findByPage`);
}

export async function createMeeting(data: {
    title: string, startTime: string, duration: number, hostId: string
}) {
    return request(`meeting/create`, data);
}

export async function deleteMeeting(_id: string) {
    return request(`meeting/delete?_id=${_id}`, {}, "delete");
}