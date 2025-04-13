import { useForm } from "react-hook-form";
import { postAuthor } from "../apiFunctions";

type Props = {
  handleClose: (changed: boolean) => void;
};

type Inputs = {
  name: string;
  bio: string;
  dateOfBirth: string;
};

export default function AuthorForm({ handleClose }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      name: "Author X",
      bio: "In sollicitudin neque non enim eleifend tempus. Curabitur sed leo vitae enim gravida consequat. In id sem ut erat iaculis commodo non nec enim.",
      dateOfBirth: "2000-01-01",
    },
  });

  async function onSubmitInput(inputs: Inputs) {
    await postAuthor(inputs);
    handleClose(true);
  }

  return (
    <div className="subtle-background">
      {/* Close Button */}
      <span className="w-full">
        <span className="text-2xl">Add Author</span>
        <button
          onClick={() => {
            handleClose(false);
          }}
          className="secondary-button float-end"
        >
          X
        </button>
      </span>
      <form
        onSubmit={handleSubmit(onSubmitInput)}
        className="table-auto border-spacing-2"
      >
        <div className="table-row">
          <label htmlFor="name" className="table-cell">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="table-cell border-b-1 border-gray-500"
            {...register("name", { required: true })}
          />
          <div className="table-cell">
            {errors.name && <div className="error-text">Required field</div>}
          </div>
        </div>
        <div className="table-row">
          <label htmlFor="bio" className="table-cell">
            Biography
          </label>
          <input
            type="text"
            id="bio"
            className="table-cell border-b-1 border-gray-500"
            {...register("bio", { required: true })}
          />
          <div className="table-cell">
            {errors.bio && <div className="error-text">Required field</div>}
          </div>
        </div>
        <div className="table-row">
          <label htmlFor="dateOfBirth" className="table-cell">
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            className="table-cell border-b-1 border-gray-500"
            {...register("dateOfBirth", { required: true })}
          />
          <div className="table-cell">
            {errors.dateOfBirth && (
              <div className="error-text">Required field</div>
            )}
          </div>
        </div>
        <div className="table-row">
          <span className="table-cell"></span>
          <button className="table-cell primary-button mt-2">Submit</button>
        </div>
      </form>
    </div>
  );
}
