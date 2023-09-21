--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: main; Type: SCHEMA; Schema: -; Owner: roman
--

CREATE SCHEMA main;


ALTER SCHEMA main OWNER TO roman;

--
-- Name: users_log(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.users_log() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
	if TG_OP = 'INSERT' then
	insert into user_log (type_event, user_id, old_val_password, old_val_username, new_val_password, new_val_username)
	values ('INSERT',NEW.id, NULL, NULL, NEW.password, NEW.name);
	elsif TG_OP = 'UPDATE' then
	insert into user_log (type_event, user_id, old_val_password, old_val_username, new_val_password, new_val_username)
	values ('UPDATE', OLD.id, OLD.password, OLD.name, NEW.password, NULL);
	elsif TG_OP = 'DELETE' then
	insert into user_log (type_event, user_id, old_val_password, old_val_username, new_val_password, new_val_username)
	values ('DELETE', OLD.id, OLD.password, OLD.name, NULL, NUll);
	end if;
	return NEW;
end;
$$;


ALTER FUNCTION public.users_log() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    content text NOT NULL,
    thread_id integer NOT NULL,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    name character varying,
    image text
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.messages ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: threads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.threads (
    id integer NOT NULL,
    title character varying(50) NOT NULL,
    theme_id integer,
    user_id integer
);


ALTER TABLE public.threads OWNER TO postgres;

--
-- Name: messages_view; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.messages_view AS
 SELECT messages.id,
    messages.name,
    messages.content,
    messages.date,
    messages.thread_id,
    messages.image,
    threads.title
   FROM (public.messages
     JOIN public.threads ON ((messages.thread_id = threads.id)));


ALTER TABLE public.messages_view OWNER TO postgres;

--
-- Name: themes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.themes (
    id integer NOT NULL,
    theme_name character varying(50) NOT NULL,
    comment text
);


ALTER TABLE public.themes OWNER TO postgres;

--
-- Name: themes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.themes ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.themes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: threads_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.threads ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.threads_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: user_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_log (
    id integer NOT NULL,
    user_id integer,
    old_val_password character varying(65),
    old_val_username character varying(50),
    new_val_password character varying(65),
    new_val_username character varying(50),
    date time without time zone DEFAULT CURRENT_TIME,
    type_event character varying
);


ALTER TABLE public.user_log OWNER TO postgres;

--
-- Name: user_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.user_log ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.user_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    password character varying(65) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: users name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT name_unique UNIQUE (name);


--
-- Name: themes themes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.themes
    ADD CONSTRAINT themes_pkey PRIMARY KEY (id);


--
-- Name: threads threads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.threads
    ADD CONSTRAINT threads_pkey PRIMARY KEY (id);


--
-- Name: threads title_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.threads
    ADD CONSTRAINT title_unique UNIQUE (title);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users user_log_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER user_log_trigger AFTER INSERT OR DELETE OR UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.users_log();


--
-- Name: threads fk_user_thread; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.threads
    ADD CONSTRAINT fk_user_thread FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;


--
-- PostgreSQL database dump complete
--

