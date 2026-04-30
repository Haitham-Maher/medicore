import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// إضافة Interceptor (معترض الطلبات)
// هذه الدالة تعمل قبل أن يخرج أي طلب من الفرونت إند إلى الباك إند
api.interceptors.request.use(
    (config) => {
        // 1. نبحث عن التوكن في الـ LocalStorage
        const token = localStorage.getItem("access_token");

        // 2. إذا وجدناه، نقوم بلصقه في الـ Headers
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    })

export default api;