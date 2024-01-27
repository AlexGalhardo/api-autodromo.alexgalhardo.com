import { Controller, Res, HttpStatus, Get, Inject, Req } from "@nestjs/common";
import { Request, Response } from "express";

interface KartControllerPort {}

@Controller("games")
export class KartController implements KartControllerPort {
    constructor() {}
}
