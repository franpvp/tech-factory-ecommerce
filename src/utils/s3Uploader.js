export async function uploadToS3(file, carpetaCategoria) {
  const bucketUrl = "https://techfactory-product-images.s3.amazonaws.com";

  const fileName = `${carpetaCategoria}/${Date.now()}-${file.name}`;

  await fetch(`${bucketUrl}/${fileName}`, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  return `${bucketUrl}/${fileName}`;
}