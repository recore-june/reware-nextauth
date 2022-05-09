import { useState, useCallback } from "react";
import styled from "styled-components";
import { signIn, useSession } from "next-auth/react";
import { Input } from "antd";
import InputSubmit from "./InputSubmit";

function login() {
  const { data: session } = useSession();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoginFail, setIsLoginFail] = useState<boolean>(false);
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
  const [failCount] = useState({
    loginFailCnt: 0,
    maxLoginFailCnt: 0,
  });

  // input values 읽어오기
  const getEmailValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value.replace(/ /gi, ""));
  };

  const getPasswordValue = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setPassword(value);
      setIsLoginFail(false);
    },
    [password]
  );

  // submit 함수
  const handleLogin = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    if (
      email?.length !== 0 &&
      password.length !== 0 &&
      typeof window !== "undefined" &&
      !session
    ) {
      setIsLoginLoading(true);

      try {
        const paramData = { userId: "", userPass: "" };
        paramData.userId = email;
        paramData.userPass = password;

        const res: any = await signIn("credentials", {
          redirect: false,
          callbackUrl: "",
          type: "login",
          username: email,
          password,
        });

        console.log(">>>", res);

        setIsLoginLoading(false);
      } catch (error) {
        setIsLoginLoading(false);
        setIsLoginFail(true);
        console.log(error);
        console.warn("Login Fail");
      }
    }
  };

  return (
    <Form onSubmit={(e) => handleLogin(e)}>
      <Input
        title="이메일"
        type="text"
        value={email || ""}
        placeholder="ID@example.com"
        onChange={(e) => getEmailValue(e)}
        autoComplete="new-email"
      />
      <Input
        title="비밀번호"
        type="password"
        value={password || ""}
        placeholder="비밀번호를 입력해주세요."
        autoComplete="new-password"
        onChange={(e) => getPasswordValue(e)}
      />
      {isLoginFail && (
        <span className="failCount">
          실패 횟수 ({failCount.loginFailCnt}/{failCount.maxLoginFailCnt})
        </span>
      )}

      <div className="btnWrapper">
        <InputSubmit loading={isLoginLoading} value="로그인" />
      </div>
    </Form>
  );
}

export default login;

const Form = styled.form`
  margin: 0 auto;
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;

  .title {
    margin: 10px 0;
    font-size: 16px;
    font-weight: bold;
  }

  .loginOption {
    position: absolute;
    left: 30px;
    bottom: 50px;
  }

  .btnWrapper {
    margin-top: 60px;
  }

  .failCount {
    position: absolute;
    right: 40px;
    bottom: 165px;
    font-size: 12px;
  }
`;
