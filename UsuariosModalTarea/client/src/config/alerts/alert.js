import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

/*
    Todos los titulos error, success, confirmar
    Todos los mensaje error, success, confirmar
*/ 

const SweetAlert  = withReactContent(Swal);


export const customAlert = (title, text, icon) => {
    return SweetAlert.fire({
        title,
        text,
        icon, 
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar"
    });
}

export const confirmAlert= (preConfirm) => SweetAlert.fire({
    title: "¿Estás seguro de realizar la accción?",
    text: "Le solicitamos esperar a que termine la acción",
    icon: "info",
    confirmButtonColor: "#0E7490",
    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
    backdrop: true,
    showCancelButton: true,
    showLoaderOnConfirm: true,
    allowOutsideClick: () => !SweetAlert.isLoading(),
    preConfirm,
})