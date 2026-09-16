import React from "react";
import { useForm } from "@tanstack/react-form";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../store/User/user-action";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const { token } = useParams();
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
    onSubmit: ({ value }) => {
      console.log(value);
      dispatch(resetPassword(value, token));
      toast.success("Password has been changed successfully");
      navigate("/login");
    },
  });

  return (
    <>

      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form
            className="shadow-lg"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <h1 className="password_title">New Password</h1>

            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) =>
                  value.length < 6
                    ? "Password must be at least 6 characters"
                    : undefined,
              }}
            >
              {(field) => (
                <div className="form-group">
                  <label htmlFor="password_field">Password</label>
                  <input
                    type="password"
                    id="password_field"
                    className="form-control"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors}
                </div>
              )}
            </form.Field>
            <form.Field
              name="passwordConfirm"
              validators={{
                onChangeListenTo: ["password"],
                onChange: ({ value, fieldApi }) =>
                  value !== fieldApi.form.getFieldValue("password")
                    ? "Password don't match"
                    : undefined,
              }}
            >
              {(field) => (
                <div className="form-group">
                  <label htmlFor="confirm_password_field">
                    Password Confirm
                  </label>
                  <input
                    type="password"
                    id="confirm_password_field"
                    className="form-control"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors}
                </div>
              )}
            </form.Field>

            <button
              id="new_password_button"
              type="submit"
              className="btn-block py-3 password-btn"
            >
              Set Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
