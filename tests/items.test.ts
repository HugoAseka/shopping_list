import app from "../src/app";
import supertest from "supertest";
import { prisma } from "../src/database";
import { items } from "@prisma/client";
import { array } from "joi";

type typeNewItem = Omit<items, "id">;

const newItem: typeNewItem = {
  title: "Samsung s20",
  url: "http://facebook.com",
  description: "Mais novo celular da samsung",
  amount: 10,
};

beforeAll(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE items;`;
});

describe("Testa POST /items ", () => {
  it("Deve retornar 201, se cadastrado um item no formato correto", async () => {
    const result = await supertest(app).post("/items").send(newItem);
    const status = result.status;
    expect(status).toEqual(201);
  });
  it("Deve retornar 409, ao tentar cadastrar um item que exista", async () => {
    const result = await supertest(app).post("/items").send(newItem);
    const status = result.status;
    expect(status).toEqual(409);
  });
});

describe("Testa GET /items ", () => {
  it("Deve retornar status 200 e o body no formato de Array", async () => {
    const result = await supertest(app).get("/items");
    const status = result.status;
    expect(status).toEqual(200);
    expect(result.body).toBeInstanceOf(Array);
  });
});

describe("Testa GET /items/:id ",  () => {
  
  it("Deve retornar status 200 e um objeto igual a o item cadastrado", async () => {
    const item = await prisma.items.findFirst();
    const result = await supertest(app).get(`/items/${item.id}`);
    expect(result.status).toEqual(200);
    expect(result.body).toEqual(item);
  });
  it("Deve retornar status 404 caso não exista um item com esse id", async () => {
    const item = await prisma.items.findFirst();
    const result = await supertest(app).get(`/items/${item.id - 1}`);
    expect(result.status).toEqual(404);
  });
});
