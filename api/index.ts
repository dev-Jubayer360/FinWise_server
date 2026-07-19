// Dynamic import to catch initialization errors (like missing env vars) gracefully
export default async function handler(req: any, res: any) {
  try {
    const { default: app } = await import('../src/app');
    const { connectDB } = await import('../src/config/database');
    
    await connectDB().catch(console.error);
    
    return app(req, res);
  } catch (error: any) {
    console.error("CRITICAL STARTUP ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server Initialization Failed",
      details: error.message,
      hint: "Check your Vercel Environment Variables. Have you added all required variables like MONGODB_URI?"
    });
  }
}
