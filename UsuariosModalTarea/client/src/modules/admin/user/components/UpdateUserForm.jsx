import {
    Button,
    Label,
    Modal,
    TextInput,
    Select,
    FileInput,
} from "flowbite-react";
import React, { useState, useEffect } from "react";
import { MdCancel } from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import { useFormik } from "formik";
import * as yup from "yup";
import { confirmAlert, customAlert } from "../../../../config/alerts/alert";
import AxiosClient from "../../../../config/http-client/axios-client";

const UpdateUserForm = ({ isUpdating, setIsUpdating, getAllUsers, userId }) => {
    const [personId, setPersonId] = useState(null);

    const closeModal = () => {
        formik.resetForm();
        setIsUpdating(false);
    };

    const handleChangeAvatar = (event) => {
        // varias imagenes son files si es solo un a es files[0]
        const files = event.target.files;
        for (const file of files) {
            const reader = new FileReader();
            reader.onloadend = (data) => {
                formik.setFieldTouched('avatar', true);
                formik.setFieldValue('avatar', data.currentTarget.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const formik = useFormik({
        initialValues: {
            personIdU: "",
            usernameU: "",
            rolesU: "",
            avatarU: "",
            nameU: "",
            surnameU: "",
            lastnameU: "",
            curpU: "",
            dateBirthU: "",
        },
        onSubmit: async (values, { setSubmitting }) => {
            confirmAlert(async () => {

                try {
                    const payload = {
                        ...values,
                        name: values.nameU,
                        surname: values.surnameU,
                        lastname: values.lastnameU,
                        birthDate: values.dateBirthU,
                        curp: values.curpU,
                        user: {
                            username: values.usernameU,
                            roles: values.rolesU ? [{ id: Number(values.rolesU) }] : [],
                            avatar: values.avatarU,
                            // Asegúrate de incluir cualquier otra propiedad de 'user' que necesites
                        },
                        // Incluye cualquier otra propiedad fuera de 'person' si es necesario
                    };


                    const response = await AxiosClient({
                        method: "PUT",
                        url: `/person/${personId}`, // Asegúrate de reemplazar `id` con el id de la persona que deseas actualizar
                        data: payload,
                    });
                    if (!response.error) {
                        customAlert(
                            "Registro exitoso",
                            "El usuario se ha registrado correctamente",
                            "success"
                        );
                        getAllUsers();
                        closeModal();
                    }
                } catch (error) {
                    console.log(error);
                    customAlert(
                        "Ocurrio un error",
                        "Error al registrar al usuario",
                        "error"
                    );
                } finally {
                    setSubmitting(false);
                }
            });
        },
    });


    // Utiliza useEffect para realizar la petición al servidor cuando cambia el userId
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await AxiosClient({
                    method: "GET",
                    url: `/user/${userId}`, // Ajusta la URL según la estructura de tu API
                });

                if (response.data) {
                    setPersonId(response.data.person.id);
                    // Establece los valores del formulario utilizando formik.setFieldValue
                    formik.setFieldValue('personIdU', response.data.person.id);
                    formik.setFieldValue('usernameU', response.data.username);
                    formik.setFieldValue('rolesU', response.data.roles[0].id);
                    formik.setFieldValue('nameU', response.data.person.name);
                    formik.setFieldValue('surnameU', response.data.person.surname);
                    formik.setFieldValue('lastnameU', response.data.person.lastname);
                    formik.setFieldValue('curpU', response.data.person.curp);
                    formik.setFieldValue('dateBirthU', response.data.person.birthDate);

                    // Actualiza manualmente el estado interno de formik
                    formik.setValues({
                        ...formik.values,
                        personIdU: response.data.person.id,
                        usernameU: response.data.username,
                        rolesU: response.data.roles[0].id,
                        nameU: response.data.person.name,
                        surnameU: response.data.person.surname,
                        lastnameU: response.data.person.lastname,
                        curpU: response.data.person.curp,
                        dateBirthU: response.data.person.birthDate,
                    });
                }
            } catch (error) {
                console.error("Error al obtener los datos del usuario:", error);
            }
        };

        fetchUserData(); // Llama a la función fetchUserData una vez cuando el componente se monta

    }, [userId]); // El array vacío indica que el efecto se ejecutará solo una vez





    return (
        <Modal show={isUpdating} size={"4xl"} onClose={() => closeModal()}>
            <Modal.Header title="Actualizar usuario" />
            <Modal.Body>
                <form
                    noValidate
                    onSubmit={formik.handleSubmit}
                    id="userFormU"
                    name="userFormU"
                >
                    <div className="flex flex-col gap-2">
                        <h3 className="font-bold text-2xl">Datos de usuario</h3>
                        <div className="grid grid-flow-col gap-2">
                            <div className="grid-cols-6">
                                <Label
                                    htmlFor="username"
                                    className="font-bold"
                                    value="Usuario"
                                />
                                <TextInput
                                    type="text"
                                    id="usernameU"
                                    name="usernameU"
                                    value={formik.values.usernameU}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    helperText={
                                        formik.touched.usernameU &&
                                        formik.errors.usernameU && (
                                            <span className="text-red-600">
                                                {formik.errors.usernameU}
                                            </span>
                                        )
                                    }
                                />
                            </div>
                            <div className="grid-cols-6">
                                <Label htmlFor="roles" className="font-bold" value="Roles" />
                                <Select
                                    placeholder="Seleccionar rol..."
                                    id="rolesU"
                                    name="rolesU"
                                    value={formik.values.rolesU}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    helperText={
                                        formik.touched.rolesU &&
                                        formik.errors.rolesU && (
                                            <span className="text-red-600">
                                                {formik.errors.rolesU}
                                            </span>
                                        )
                                    }
                                >
                                    <option value="1">ADMIN</option>
                                    <option value="2">USER</option>
                                    <option value="3">CLIENTE</option>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-flow-col gap-2">
                            <div className="grid-cols-6">
                                <Label htmlFor="avatar" className="font-bold" value="Avatar" />
                                <FileInput
                                    id="avatarU"
                                    name="avatar"
                                    onChange={(e) => handleChangeAvatar(e)}
                                />
                            </div>
                        </div>
                        <h3 className="font-bold text-2xl">Datos personales</h3>
                        <div className="grid grid-flow-col gap-2">
                            <div className="grid-cols-6">
                                <Label htmlFor="name" className="font-bold" value="Nombre" />
                                <TextInput
                                    type="text"
                                    id="nameU"
                                    name="nameU"
                                    value={formik.values.nameU}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    helperText={
                                        formik.touched.nameU &&
                                        formik.errors.nameU && (
                                            <span className="text-red-600">{formik.errors.nameU}</span>
                                        )
                                    }
                                />
                            </div>
                            <div className="grid-cols-6">
                                <Label
                                    htmlFor="surname"
                                    className="font-bold"
                                    value="Apellido paterno"
                                />
                                <TextInput
                                    type="text"
                                    id="surnameU"
                                    name="surnameU"
                                    value={formik.values.surnameU}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    helperText={
                                        formik.touched.surnameU &&
                                        formik.errors.surnameU && (
                                            <span className="text-red-600">
                                                {formik.errors.surnameU}
                                            </span>
                                        )
                                    }
                                />
                            </div>
                            <div className="grid-cols-6">
                                <Label
                                    htmlFor="lastname"
                                    className="font-bold"
                                    value="Apellido materno"
                                />
                                <TextInput
                                    type="text"
                                    id="lastnameU"
                                    name="lastnameU"
                                    value={formik.values.lastnameU}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    helperText={
                                        formik.touched.lastnameU &&
                                        formik.errors.lastnameU && (
                                            <span className="text-red-600">
                                                {formik.errors.lastnameU}
                                            </span>
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-flow-col gap-2">
                            <div className="grid-cols-6">
                                <Label htmlFor="curp" className="font-bold" value="CURP" />
                                <TextInput
                                    type="text"
                                    id="curpU"
                                    name="curpU"
                                    value={formik.values.curpU}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    helperText={
                                        formik.touched.curpU &&
                                        formik.errors.curpU && (
                                            <span className="text-red-600">{formik.errors.curpU}</span>
                                        )
                                    }
                                />
                            </div>
                            <div className="grid-cols-6">
                                <Label
                                    htmlFor="dateBirth"
                                    className="font-bold"
                                    value="Fecha de nacimiento"
                                />
                                <TextInput
                                    type="date"
                                    id="dateBirthU"
                                    name="dateBirthU"
                                    value={formik.values.dateBirthU}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    helperText={
                                        formik.touched.dateBirthU &&
                                        formik.errors.dateBirthU && (
                                            <span className="text-red-600">
                                                {formik.errors.dateBirthU}
                                            </span>
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer className="flex justify-end gap-2">
                <Button color="gray" onClick={() => closeModal()}>
                    <MdCancel size={"15px"} />
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    form="userFormU"
                    disabled={formik.isSubmitting || !formik.isValid}
                    color="success"
                >
                    <IoIosSend size={"15px"} />
                    Enviar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UpdateUserForm;
