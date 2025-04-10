import { SubmitHandler, useForm } from "react-hook-form";
import { apiAxios } from "../axios";
import { AxiosError } from "axios";
import { useNavigate } from "react-router";

type Inputs = {
  email: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const navigate = useNavigate();

  console.log(errors);

  const onSubmit: SubmitHandler<Inputs> = async (inputs) => {
    try {
      await apiAxios({
        method: "POST",
        url: "/login",
        data: JSON.stringify(inputs),
      });
      navigate("/admin");
    } catch (err) {
      const e = err as AxiosError;
      if (e.status === 401) {
      } else {
        throw err; // propagate all other errors
      }
      console.log(err);
    }
  };

  return (
    <>
      <h1 className="text-3xl">Login</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="table-auto border-spacing-4"
      >
        <div className="table-row">
          <label htmlFor="email" className="table-cell">
            E-Mail
          </label>
          <input
            type="email"
            id="email"
            defaultValue="admin@books"
            // required={true}
            className="table-cell border-b-2"
            {...register("email", {
              required: "Please enter your e-mail",
            })}
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && (
            <div className="text-orange-300">{errors.email.message}</div>
          )}
        </div>
        <div className="table-row">
          <label htmlFor="password" className="table-cell">
            Password
          </label>
          <input
            type="password"
            id="password"
            defaultValue="123"
            // required={true}
            className="table-cell border-b-2"
            {...register("password", {
              required: "Please enter your password",
              minLength: 3,
            })}
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.password && errors.password.type === "required" && (
            <div className="text-orange-300">{errors.password.message}</div>
          )}
          {errors.password && errors.password.type === "minLength" && (
            <div className="text-orange-300 w-[200px]">
              Password needs to be at least 3 characters long
            </div>
          )}
        </div>
        <button className="primary-button">Log In</button>
      </form>
    </>
  );
};

export default Login;
