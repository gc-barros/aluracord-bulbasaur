import { Box, Text, TextField, Image, Button, Icon } from "@skynexui/components";
import { useRouter } from "next/router";
import React from "react";
import appConfig from "../config.json";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzQ2NjA4MSwiZXhwIjoxOTU5MDQyMDgxfQ.ogv6-GRISfEa0Njc7EACvXz0VBB0u88ffiSJbvIuoTo";
const SUPABASE_URL = "https://qbfsnmmnhljbwmrnxzxt.supabase.co";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function ChatPage() {
  const [mensagem, setMensagem] = React.useState("");
  const [listaDeMensagens, setListaDeMensagens] = React.useState([]);
  const router = useRouter();
  const {username} = router.query;

  React.useEffect(() => {
    supabaseClient
      .from('mensagens')
      .select('*')
      .order('id', { ascending: false})
      .then((dados) => {
        console.log("Dados da consulta: ", dados.data);
        setListaDeMensagens(dados.data);
      });
  }, []);

  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      // id: listaDeMensagens.length + 1,
      de: username,
      texto: novaMensagem,
      delete: false
    };

    supabaseClient
      .from('mensagens')
      // Tem que ser um objeto com os mesmos campos do supabase
      .insert([mensagem])
      .then(({ data }) => {
        console.log("Criando mensagem", data);
        setListaDeMensagens([data[0], ...listaDeMensagens]);
      })

    // setListaDeMensagens([mensagem, ...listaDeMensagens]);
    setMensagem("");
  }

  function recarregarMensagens() {
    setListaDeMensagens(listaDeMensagens.filter(function (mensagem) {
      return !mensagem.delete
    }));
  }

  async function handleDeletaMensagem(idNumber) {
    console.log('deletando')
    const { data, error } = await supabaseClient
      .from('mensagens')
      .delete()
      .match({ id: idNumber})
  }

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.neutrals[400],
        backgroundImage: `url(/bulbassaur.jfif)`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center bottom",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: ".7rem 0 .7rem",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "500px",
          maxHeight: "90vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: ".7rem 0 .7rem",
            padding: "16px",
          }}
        >
          <MessageList
            username={username}
            mensagens={listaDeMensagens}
            recarregarMensagens={recarregarMensagens}
            handleDeletaMensagem={handleDeletaMensagem}
          />

          {/* Lista de mensagens: {
            listaDeMensagens.map((mensagemAtual) => {
              return (
                <li key={mensagemAtual.id}>
                  {mensagemAtual.de}: {mensagemAtual.texto}
                </li>
              )
            })
          } */}

          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              value={mensagem}
              onChange={(event) => {
                setMensagem(event.target.value);
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleNovaMensagem(mensagem);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: ".5rem 0 .5rem",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                handleNovaMensagem(mensagem);
              }}
              style={{
                backgroundColor: appConfig.theme.colors.bulbasaur[200],
                padding: ".81rem",
                color: "#FFF",
                borderRadius: ".5rem 0 .5rem",
                border: "none",
                fontSize: "1.2rem",
                cursor: "pointer",
                marginBottom: "8px",
              }}
            >
              <Icon label="Icon Component" name="FaArrowRight" />
            </button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Sair"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList(props) {
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "auto",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {props.mensagens.map((mensagem) => {
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            <Box
              styleSheet={{
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Image
                styleSheet={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/${mensagem.de}.png`}
              />
              <Text
                tag="strong"
                styleSheet={{
                  color: appConfig.theme.colors.bulbasaur[100],
                }}
              >
                {mensagem.de}
              </Text>
              <Text
                styleSheet={{
                  fontSize: "10px",
                  marginLeft: "8px",
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {new Date(mensagem.created_at).toLocaleDateString("pt-br", {hour: "numeric", minute: "numeric", second: "numeric"})}
              </Text>
              <Icon
                name={"FaTrash"}
                styleSheet={{
                  display: props.username === mensagem.de ? "block" : "none",
                  marginLeft: "auto",
                  marginRight: ".7rem",
                  transition: ".4s ease all",
                  cursor: "pointer",
                  hover: {
                    color: appConfig.theme.colors.bulbasaur[100],
                  },
                }}
                onClick={() => {
                  mensagem.delete = true;
                  props.handleDeletaMensagem(mensagem.id);
                  props.recarregarMensagens();
                }}
              ></Icon>
            </Box>
            {mensagem.texto}
          </Text>
        );
      })}
    </Box>
  );
}
