import {
  Button,
  Label,
  Modal,
  TextInput,
  Select,
  FileInput,
} from "flowbite-react";
import React from "react";
import { MdCancel } from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import { useFormik } from "formik";
import * as yup from "yup";
import { confirmAlert, customAlert } from "../../../../config/alerts/alert";
import AxiosClient from "../../../../config/http-client/axios-client";

const RegisterUserForm = ({ isCreating, setIsCreating, getAllUsers }) => {
  const closeModal = () => {
    formik.resetForm();
    setIsCreating(false);
  };

  const handleChangeAvatar = (event) => {
    // varias imagenes son files si es solo un a es files[0]
    const files = event.target.files;
    for(const file of files){
      const reader = new FileReader();
      reader.onloadend= (data) => {
        formik.setFieldTouched('avatar', true);
        formik.setFieldValue('avatar', data.currentTarget.result);
      };
      reader.readAsDataURL(file);
    }
  }

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
      roles: "",
      avatar: "",
      name: "",
      surname: "",
      lastname: "",
      curp: "",
      dateBirth: "",
    },
    validationSchema: yup.object().shape({
      username: yup
        .string()
        .required("Campo requerido")
        .min(3, "Minimum 3 caracteres")
        .max(45, "Maximum 45 caracteres"),
      password: yup
        .string()
        .required("Campo requerido")
        .min(8, "Minimum 8 caracteres")
        .max(45, "Maximum 45 caracteres"),
      // .matches() valida formatos
      confirmPassword: yup
        .string()
        .required("Campo requerido")
        .test(
          "password-matches",
          "Las contraseñas no coinciden",
          function (value) {
            return value === this.parent.password;
          }
        ),
      name: yup
        .string()
        .required("Campo requerido")
        .min(3, "Minimum 3 caracteres")
        .max(45, "Maximum 45 caracteres"),
      surname: yup
        .string()
        .required("Campo requerido")
        .min(3, "Minimum 3 caracteres")
        .max(45, "Maximum 45 caracteres"),
      lastname: yup
        .string()
        .min(3, "Minimum 3 caracteres")
        .max(45, "Maximum 45 caracteres"),
      curp: yup
        .string()
        .required("Campo requerido")
        .min(18, "Minimum 18 caracteres")
        .max(18, "Maximum 18 caracteres"),
      //matches para validar el uppercase de la CURP
      dateBirth: yup
        .string()
        .required("Campo requerido")
        .min(10, "Minimum 10 caracteres")
        .max(10, "Maximum 10 caracteres"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      confirmAlert(async () => {
        try {
          const payload = {
            ...values,
            birthDate: values.dateBirth,
            user: {
              username: values.username,
              password: values.password,
              avatar: values.avatar,
              roles: [{ id: values.roles }],
            },
          };
          const response = await AxiosClient({
            method: "POST",
            url: "/person/",
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
  return (
    <Modal show={isCreating} size={"4xl"} onClose={() => closeModal()}>
      <Modal.Header title="Registrar usuario" />
      <Modal.Body>
        <form
          noValidate
          onSubmit={formik.handleSubmit}
          id="userForm"
          name="userForm"
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
                  id="username"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.touched.username &&
                    formik.errors.username && (
                      <span className="text-red-600">
                        {formik.errors.username}
                      </span>
                    )
                  }
                />
              </div>
              <div className="grid-cols-6">
                <Label htmlFor="roles" className="font-bold" value="Roles" />
                <Select
                  placeholder="Seleccionar rol..."
                  id="roles"
                  name="roles"
                  value={formik.values.roles}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.touched.roles &&
                    formik.errors.roles && (
                      <span className="text-red-600">
                        {formik.errors.roles}
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
                <Label
                  htmlFor="password"
                  className="font-bold"
                  value="Contraseña"
                />
                <TextInput
                  type="password"
                  id="password"
                  name="password"
                  placeholder="****"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.touched.password &&
                    formik.errors.password && (
                      <span className="text-red-600">
                        {formik.errors.password}
                      </span>
                    )
                  }
                />
              </div>
              <div className="grid-cols-6">
                <Label
                  htmlFor="confirmPassword"
                  className="font-bold"
                  value="Confirmar contraseña"
                />
                <TextInput
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="****"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <span className="text-red-600">
                        {formik.errors.confirmPassword}
                      </span>
                    )
                  }
                />
              </div>
            </div>
            <div className="grid grid-flow-col gap-2">
              <div className="grid-cols-6">
                <Label htmlFor="avatar" className="font-bold" value="Avatar" />
                <FileInput
                  id="avatar"
                  name="avatar"
                  onChange={ (e) => handleChangeAvatar(e) }
                />
              </div>
            </div>
            <h3 className="font-bold text-2xl">Datos personales</h3>
            <div className="grid grid-flow-col gap-2">
              <div className="grid-cols-6">
                <Label htmlFor="name" className="font-bold" value="Nombre" />
                <TextInput
                  type="text"
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.touched.name &&
                    formik.errors.name && (
                      <span className="text-red-600">{formik.errors.name}</span>
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
                  id="surname"
                  name="surname"
                  value={formik.values.surname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.touched.surname &&
                    formik.errors.surname && (
                      <span className="text-red-600">
                        {formik.errors.surname}
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
                  id="lastname"
                  name="lastname"
                  value={formik.values.lastname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.touched.lastname &&
                    formik.errors.lastname && (
                      <span className="text-red-600">
                        {formik.errors.lastname}
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
                  id="curp"
                  name="curp"
                  value={formik.values.curp}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.touched.curp &&
                    formik.errors.curp && (
                      <span className="text-red-600">{formik.errors.curp}</span>
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
                  id="dateBirth"
                  name="dateBirth"
                  value={formik.values.dateBirth}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.touched.dateBirth &&
                    formik.errors.dateBirth && (
                      <span className="text-red-600">
                        {formik.errors.dateBirth}
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
          form="userForm"
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

export default RegisterUserForm;
