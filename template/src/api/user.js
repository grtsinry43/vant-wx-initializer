import ins from "@/api/request.js";

export function getUserInfo() {
    return ins.get("/auth/myinfo");
}
