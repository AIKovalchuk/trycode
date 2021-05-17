import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../provider/auth/Auth";

const Login: React.FC = () => {
  const { login } = useAuth();
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };

    const email = target.email.value;
    const password = target.password.value;

    try {
      setError("");
      setLoading(true);
      await login(email, password);
      history.push("/");
    } catch {
      setError("Failed to log in");
    }

    setLoading(false);
  };

  return (
    <div>
      {error && "Error: " + error}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" required />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" required />

        <button disabled={loading} type="submit">
          Log In
        </button>
      </form>

      <div>
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
};

export default Login;
