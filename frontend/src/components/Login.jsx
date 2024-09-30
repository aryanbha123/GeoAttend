import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../AuthContext";

const LoginPage = () => {

  const {baseurl , login} = useAuth();
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    // e.preventDefault();
    // setLoading(true);

    
    const loginPromise = login({ username, password });

    // toast.promise(
    //   loginPromise,
    //   {
    //     loading: "Logging in...",
    //     success: "Login successful! Redirecting...",
    //     error: "Invalid username or password.",
    //   },
    //   {
    //     duration: 4000,
    //     style: {
    //       borderRadius: "10px",
    //       background: "#333",
    //       color: "#fff",
    //     },
    //   }
    // );

    // try {
    //   const response = await loginPromise;
    //   // Handle successful login, e.g., navigate to another page
    //   console.log(response.data);
      
    //   setLoading(false);
    // } catch (error) {
    //   setLoading(false);
    //   console.error("Login failed:", error);
    // }
  };

  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleLogin} style={{ width: "100%" }}>
          <TextField
            label="username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setusername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            style={{ marginTop: "1rem" }}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;
