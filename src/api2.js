import axios from 'axios';
import Swal from 'sweetalert2';

const instance =  axios.create({
    baseURL: "https://essuat.equicom.com/CWTIndexingAPI/api/"
    //baseURL: "http://172.16.17.70/ECSFinancialAPI/api/"
    //baseURL: "https://localhost:44314/api/"
});

instance.interceptors.response.use(response => {
    return response;
}, error =>{
    if (error.response.status === 401) {
        Swal.fire({
            icon: 'error',
            title: 'Connection Timed OUT!',
            text: 'Please Login again.'
          }).then(() =>window.location.reload());
    }
    return error;
});

instance.interceptors.request.use((config) => {
    config.headers.common["Authorization"] = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZXYiLCJqdGkiOiI0NDgyNzgyNi0wY2Q3LTQzOGUtOTQxYi0yZGQ5MjVmMjI1NzkiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImRldiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6WyJSb2xlMSIsIlJvbGUyIl0sImV4cCI6MTY0NzkzMDQ3NCwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3QiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdCJ9.Thd4NvuW5rcvFr9KKiyArHVSLoj4LSbIgisLeZxH3EY`;
    return config;
  });


export default instance;
