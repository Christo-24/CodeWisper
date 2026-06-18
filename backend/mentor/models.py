from django.db import models

class LatestCapture(models.Model):
	problem = models.TextField(blank=True, default="")
	code = models.TextField(blank=True, default="")
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ["-updated_at"]

	def __str__(self):
		return f"LatestCapture(updated_at={self.updated_at})"
