import { useState } from "react";
import { FormControl, FormLabel, Input, Box, Heading, Button } from "@chakra-ui/react";
import "./style.scss";

import axios from "@/modules/axios.js";
import { toast } from "react-toastify";

const Register = ({ setCookie }) => {

  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const showErrorPopup = (text) => {
    toast.error(text, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  const submit = async () => {
    if (!login.length || !email.length || !password.length) {
      showErrorPopup("All inputs are required!")
      return;
    }

    try {
      const response = await axios("register", {
        method: "POST",
        data: {
          login,
          email,
          password,
        },
      });

      const data = response.data;

      switch (data.status) {
        case 400:
        case 500: {
          showErrorPopup(data.text);
          break;
        }

        case 200: {
          setCookie("token", data.token, { maxAge: 30 * 60 * 1000 }); // 30m cookie

        }
      }
    } catch (e) {
      showErrorPopup("Error occurred!");

      console.log(e);
    }
  };

  return (
    <div className="page-container">
      <Box className="form-container" borderRadius="md" bg="white" borderWidth="1px" padding={[100, 10]}>
        <Heading as="h2">Register Form</Heading>
        <form>
          <FormControl>
            <FormLabel>Login *</FormLabel>
            <Input type="text" onInput={(event) => setLogin(event.nativeEvent.target.value)} />
          </FormControl>

          <FormControl>
            <FormLabel>Email *</FormLabel>
            <Input type="email" onInput={(event) => setEmail(event.nativeEvent.target.value)} />
          </FormControl>

          <FormControl>
            <FormLabel>Password *</FormLabel>
            <Input type="password" autoComplete="none" onInput={(event) => setPassword(event.nativeEvent.target.value)} />
          </FormControl>

          <Button onClick={submit} className="submit-button" colorScheme="teal">
            Submit
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default Register;
