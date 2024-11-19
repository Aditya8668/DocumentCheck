document.getElementById("compareBtn").addEventListener("click", async () => {
    const file1 = document.getElementById("file1").files[0];
    const file2 = document.getElementById("file2").files[0];
  
    if (!file1 || !file2) {
      alert("Please upload both files!");
      return;
    }
  
    try {
      const content1 = await extractText(file1);
      const content2 = await extractText(file2);
  
      if (content1 === content2) {
        document.getElementById("resultOutput").innerText = "The files have the SAME content.";
      } else {
        document.getElementById("resultOutput").innerText = "The files have DIFFERENT content.";
      }
    } catch (error) {
      alert("Error processing files: " + error.message);
    }
  });
  
  // Function to extract text based on file type
  async function extractText(file) {
    const fileType = file.name.split(".").pop().toLowerCase();
  
    if (fileType === "pdf") {
      return await extractTextFromPDF(file);
    } else if (fileType === "txt") {
      return await extractTextFromTXT(file);
    } else {
      throw new Error("Unsupported file type. Only PDF and TXT files are supported.");
    }
  }
  
  // Extract text from PDF using PDF.js
  async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
  
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(" ");
    }
  
    return text;
  }
  
  // Extract text from TXT file
  async function extractTextFromTXT(file) {
    const text = await file.text();
    return text.trim(); // Remove leading/trailing whitespace
  }
  