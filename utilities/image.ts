class ImgurHandler {

    private static readonly IMGUR_API_URL = "https://api.imgur.com/3/image";
    private static readonly IMGUR_TOKEN = 'd63ed5734369f3f';
    private image : string;

    constructor(image: string) {
        this.image = image;
    }

    public async uploadImage() {
        const formData = new FormData();
        formData.append('image', this.image);
        const response = await fetch(ImgurHandler.IMGUR_API_URL, {
            method: 'POST',
            headers: {
                Authorization: `Client-ID ${ImgurHandler.IMGUR_TOKEN}`
            },
            body: formData
        });
        const data = await response.json();
        return data.data.link;
    }

}