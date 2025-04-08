public class Book
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string Isbn { get; set; } = null!;
    public int Quantity { get; set; }
    public int Price { get; set; }
    public DateOnly PublishDate { get; set; }
    public string Description { get; set; } = null!;
    public int PageCount { get; set; }
    public string ImageUrl { get; set; } = null!;

    public int GenreId { get; set; }
    public Genre Genre { get; set; } = null!;

    public List<Author> Authors { get; set; } = [];
}
