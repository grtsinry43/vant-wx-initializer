import ins from "@/api/request.js";

export function wxLogin(code) {
    return ins.post("/auth/login", {code});
}
