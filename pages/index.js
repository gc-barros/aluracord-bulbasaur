import { Box, Button, Text, TextField, Image } from "@skynexui/components";
import React from "react";
import appConfig from "../config.json";
import { useRouter } from 'next/router';

function Titulo(props) {
  const Tag = props.tag || "h1";
  return (
    <>
      <Tag>{props.children}</Tag>
      <style jsx>{`
        ${Tag} {
          color: ${appConfig.theme.colors.neutrals["000"]};
          font-size: 24px;
          font-weight: 600;
        }
      `}</style>
    </>
  );
}

export default function PaginaInicial() {
  const [username, setUsername] = React.useState("");
  const [typedname, setTypedname] = React.useState("");
  const [userinfo, setUserinfo] = React.useState("");
  // Timeout para a escrita
  const [typeTimeout, setTypeTimeout] = React.useState("");
  const roteamento = useRouter();

  return (
    <>
      <Box
        styleSheet={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: appConfig.theme.colors.neutrals[400],
          backgroundImage: "url(/bulbassaur.jfif)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center bottom",
          backgroundSize: "cover",
          backgroundBlendMode: "multiply",
        }}
      >
        <Box
          styleSheet={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            width: "100%",
            maxWidth: "700px",
            borderRadius: "1rem 0 1rem",
            padding: "32px",
            margin: "16px",
            boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
            backgroundColor: appConfig.theme.colors.neutrals[700],
            border: "1px solid",
            borderColor: appConfig.theme.colors.neutrals[800],
          }}
        >
          {/* Formulário */}
          <Box
            as="form"
            onSubmit={function (event) {
              event.preventDefault();
              roteamento.push(`/chat?username=${username}`);
            }}
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: "100%", sm: "50%" },
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            <Titulo tag="h2">
              🌷 Bem-vindo(a)
              {userinfo.name ? `, ${userinfo.name.split(" ")[0]}` : " de volta"}
              !
            </Titulo>
            <Text
              variant="body3"
              styleSheet={{
                marginBottom: "32px",
                marginTop: ".5rem",
                color: appConfig.theme.colors.neutrals[300],
              }}
            >
              {appConfig.name}
            </Text>

            <TextField
              fullWidth
              styleSheet={{
                marginBottom: ".5rem",
                borderRadius: ".7rem 0 .7rem",
              }}
              textFieldColors={{
                neutral: {
                  textColor: appConfig.theme.colors.neutrals[200],
                  mainColor: appConfig.theme.colors.neutrals[900],
                  mainColorHighlight: appConfig.theme.colors.bulbasaur[300],
                  backgroundColor: appConfig.theme.colors.neutrals[800],
                },
              }}
              placeholder="GitHub username"
              onChange={function (event) {
                // Onde tá o valor?
                const valor = event.target.value;
                // Trocar o valor da variável
                setTypedname(valor);

                if (typeTimeout) {
                  clearTimeout(typeTimeout);
                }

                setTypeTimeout(
                  setTimeout(() => {
                    if (typedname.length > 1) {
                      fetch("https://api.github.com/users/" + valor)
                      .then(async function (response) {
                        if (response.ok) {
                          await response.json()
                          .then(function (json) {
                            setUsername(valor);
                            setUserinfo(json);
                          });
                        }
                      })
                      .catch(function (error) {
                        console.log(error);
                      });
                    }
                  }, 100)
                );
              }}
            />
            <Button
              type="submit"
              label="Entrar"
              disabled={username < 1}
              fullWidth
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.bulbasaur[200],
                mainColorLight: appConfig.theme.colors.bulbasaur[300],
                mainColorStrong: appConfig.theme.colors.bulbasaur[100],
              }}
              styleSheet={{
                borderRadius: ".7rem 0 .7rem",
              }}
            />
          </Box>
          {/* Formulário */}

          {/* Photo Area */}
          <Box
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "200px",
              padding: "16px",
              backgroundColor: appConfig.theme.colors.neutrals[800],
              border: "1px solid",
              borderColor: appConfig.theme.colors.neutrals[900],
              borderRadius: "10px",
              flex: 1,
              minHeight: "240px",
              borderRadius: "1rem 0 1rem",
            }}
          >
            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: "3px 10px",
                borderRadius: "1000px",
                minHeight: "20px",
              }}
            >
              {username || "Bulba?"}
            </Text>
            <Image
              styleSheet={{
                borderRadius: "50%",
                marginBottom: "16px",
                marginTop: "1rem",
              }}
              src={
                username.length > 1
                  ? `https://github.com/${username}.png`
                  : `https://i.gifer.com/8XbJ.gif`
              }
            />
            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                fontSize: ".8rem",
                fontWeight: "600",
                padding: "3px 10px",
                borderRadius: "1000px",
                minHeight: "20px",
              }}
            >
              {userinfo.name ? `🌱 ${userinfo.name}` : ""}
            </Text>
          </Box>
          {/* Photo Area */}
        </Box>
      </Box>
    </>
  );
}