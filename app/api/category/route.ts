import prisma from "@/lib/prisma"
 
export async function GET() {
    try {
        const categories = await prisma.category.findMany()
        
        return Response.json({ data: categories, status: 200 })
    } catch (error) {
        return Response.json({ error: "Error fetching categories", status: 500 })   
    }
}