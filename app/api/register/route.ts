import bcrypt from "bcrypt";

import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(req: Request) {
    try {
        const {email, password, name} = await req.json();

        if (!email ||!password ||!name) {
            return new NextResponse('Missing email or password', {status: 400});
        }
    
        const hashedPassword = await bcrypt.hash(password, 12);
    
        const user = await prisma.user.create({
            data: {
                name,
                email,
                hashedPassword
            }
        })
    
        return NextResponse.json(user);
    } catch (error) {
        console.log(error, "REGISTER ERROR");
        return new NextResponse("Internal Error", {status: 500});
    }
 
}